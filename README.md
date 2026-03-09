# PII Sentinel v2.0 🛡️

A robust, zero-trust client-side utility designed to detect, mask, and redact Personally Identifiable Information (PII) and sensitive credentials from raw text and log files before they leave your machine.

## 📖 Overview

Data leakage doesn't just happen through sophisticated breaches; it happens when developers and support teams accidentally paste raw logs, customer tickets, or code snippets containing sensitive data into LLM prompts, public forums, or chat interfaces.

PII Sentinel v2.0 acts as a localized air-gap. It processes text entirely within your browser's memory, utilizing advanced pattern recognition and checksum validations to sanitize data without ever sending a single byte to an external server. 

## 🚀 What's New in V2.0 (The Upgrade)
Version 2.0 shifts from simple regex matching to intelligent, customizable data sanitization:
* **Luhn Algorithm Validation:** Credit card detection isn't just pattern-based anymore; it uses the Luhn algorithm to mathematically validate CC numbers, drastically reducing false positives.
* **Credential Hunting:** Added strict detection for API Keys and authentication tokens.
* **Granular Scope Control:** Users can toggle specific detection scopes (Emails, Phone Numbers, IPv4, CCs, API Keys) on or off depending on the context of the data.
* **Dynamic Redaction Styles:** Choose between **Full Redaction** (e.g., `[EMAIL REMOVED]`) or **Partial Masking** (e.g., `j***@gmail.com`) for debugging context.
* **File Handling:** Directly upload `.txt` or `.log` files for bulk sanitization, and export the safe output with a single click.

## ⚙️ Core Architecture & Privacy
* **Zero-Trust Processing:** 100% Client-Side. No APIs, no backends, no telemetry.
* **Tech Stack:** Built with semantic HTML5, modern CSS3 (Dark UI), and Vanilla JavaScript for lightweight, rapid DOM manipulation and regex execution.

## 🛠️ How to Use
1.  **Input Data:** Paste your raw logs/text into the left panel, or click `Upload File` to parse an existing document.
2.  **Configure Sentinel:** * Select your **Detection Scope** checkboxes based on what you need to hide.
    * Select your **Redaction Style** (Full or Partial).
3.  **Sanitize:** Click `Scan & Redact`.
4.  **Export:** Copy the sanitized text to your clipboard or click `Save` to download the clean file.

## 🔮 Future Roadmap (v3.0)
* **WebAssembly (Wasm) Integration:** Offload regex processing to Wasm to handle massive, multi-gigabyte log files without blocking the main UI thread.
* **Custom Regex Injector:** Allow enterprise users to define and save their own proprietary patterns (e.g., internal employee ID formats).
* **IPv6 & MAC Address Support:** Expanding the network telemetry detection scope.

## 👨‍💻 Authorship
**Built by LAKSHAN S.M** | Electronics & Communication Engineering @ Velammal College of Engineering and Technology.
*Co-authored with Gemini AI for complex logic validation and code refinement.*