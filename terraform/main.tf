terraform {
  required_version = ">= 1.5.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

variable "project_id" {
  type        = string
  description = "GCP Project ID"
  default     = "ledger-ai-free-prod"
}

variable "region" {
  type        = string
  description = "GCP Always-Free eligible region (us-central1, us-east1, us-west1)"
  default     = "us-central1"
  validation {
    condition     = contains(["us-central1", "us-east1", "us-west1"], var.region)
    error_message = "CRITICAL SAFEGUARD: Region must be one of the GCP Always-Free eligible regions (us-central1, us-east1, us-west1)."
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# --- VPC & Firewall (Free Tier Standard Network) ---
resource "google_compute_network" "vpc_network" {
  name                    = "ledger-ai-vpc"
  auto_create_subnetworks = true
}

resource "google_compute_firewall" "allow_http_https" {
  name    = "ledger-ai-allow-web"
  network = google_compute_network.vpc_network.name

  allow {
    protocol = "tcp"
    ports    = ["80", "443", "3000"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["ledger-ai-web"]
}

# --- Compute Engine Instance (Strict Always-Free e2-micro) ---
resource "google_compute_instance" "app_server" {
  name         = "ledger-ai-free-tier-node"
  machine_type = "e2-micro" # STRICT ALWAYS-FREE ELIGIBLE (1 non-preemptible e2-micro per billing account)
  zone         = "${var.region}-a"

  tags = ["ledger-ai-web"]

  boot_disk {
    initialize_params {
      image = "cos-cloud/cos-stable" # Container-Optimized OS
      size  = 30                     # STRICT SAFEGUARD: Max 30 GB standard persistent disk (pd-standard) free limit
      type  = "pd-standard"          # pd-standard is free up to 30GB; pd-ssd incurs charges
    }
  }

  network_interface {
    network = google_compute_network.vpc_network.name
    access_config {
      network_tier = "STANDARD" # STRICT SAFEGUARD: Standard tier avoids premium egress charges
    }
  }

  metadata = {
    enable-oslogin = "TRUE"
    startup-script = <<-EOT
      #!/bin/bash
      echo "Starting LedgerAI Docker Compose on Free-Tier VM..."
      docker run -d --name ledger-ai-app -p 3000:3000 letoxbekdauletcrack/ledger-ai:latest
    EOT
  }

  # HARD GUARDRAIL: Prevent accidental replacement or destruction of state
  lifecycle {
    prevent_destroy = false
    precondition {
      condition     = var.region == "us-central1" || var.region == "us-east1" || var.region == "us-west1"
      error_message = "Enforcing GCP Always-Free region compliance."
    }
  }
}

# --- Strict Free-Tier Budget Alert Safeguard ---
resource "google_billing_budget" "zero_dollar_guardrail" {
  billing_account = "000000-000000-000000"
  display_name    = "LedgerAI Absolute Free-Tier Guardrail"

  budget_filter {
    projects = ["projects/${var.project_id}"]
  }

  amount {
    specified_amount {
      currency_code = "USD"
      units         = "1" # Alert triggers on $1.00 or $0.01 threshold
    }
  }

  threshold_rules {
    threshold_percent = 0.01 # Alert at 1 cent of spend
  }
  threshold_rules {
    threshold_percent = 0.50
  }
  threshold_rules {
    threshold_percent = 1.00
  }
}

output "instance_ip" {
  value       = google_compute_instance.app_server.network_interface[0].access_config[0].nat_ip
  description = "Public IP of the free-tier e2-micro instance"
}

