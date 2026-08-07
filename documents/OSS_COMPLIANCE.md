# Open Source Software (OSS) Legal Attributions & Compliance

HQFAST respects open-source intellectual property. All integrated third-party libraries are isolated under clean software interfaces and documented below.

---

## 1. Third-Party Open Source Libraries

### QOBLIB — Quantum Optimization Benchmarking Library
* **Source**: Zuse Institute Berlin (ZIB) & IBM Quantum (*Nature Computational Science*, 2026)
* **Code License**: Apache License 2.0
* **Data License**: Creative Commons Attribution 4.0 International (CC-BY 4.0)
* **Isolation Path**: `src/orchestrator/vendor/qoblib/`
* **Compliance Status**: 100% Compliant. Original `LICENSE` and `NOTICE` files are preserved in the vendor module.

### PySCF — Python-Based Simulations of Chemistry Framework
* **Source**: PySCF Development Team
* **License**: Apache License 2.0
* **Compliance Status**: 100% Compliant. Used as a library dependency for ab-initio integrals.

### Qiskit & Qiskit IBM Runtime
* **Source**: IBM Quantum / Qiskit Community
* **License**: Apache License 2.0
* **Compliance Status**: 100% Compliant. Used for quantum circuit compilation and remote QPU hardware primitives.

### Quimb — Quantum Information & Tensor Networks
* **Source**: Johnnie Gray
* **License**: Apache License 2.0
* **Compliance Status**: 100% Compliant. Used for Matrix Product State sweeps.

---

## 2. IP Clean-Room Statement

HQFAST does **NOT** incorporate any GPL, AGPL, or viral copyleft code. All integrated dependencies use permissive Apache 2.0 or BSD 3-Clause licenses. The proprietary core engine (`src/core/`, `src/domain/`, `src/orchestrator/`) remains 100% owned by HQFAST Inc.
