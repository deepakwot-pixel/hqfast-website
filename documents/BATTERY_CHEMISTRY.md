# Solid-State Battery SEI Degradation & Dendrite Physics Case Study

## Executive Summary
Solid-State Lithium Batteries (SSLBs) promise higher energy density and thermal safety than conventional liquid-electrolyte lithium-ion cells. However, **Solid Electrolyte Interphase (SEI) mechanical breakdown** under extreme fast-charging remains the primary failure mode preventing commercialization.

HQFAST's multi-scale simulation engine models the exact atomistic degradation sequence of SEI components ($\text{LiF}$, $\text{Li}_2\text{CO}_3$, solvated $\text{Li}^+$-EC complexes), predicting mechanical stress and dendrite growth velocity in seconds.

---

## 1. Physical Mechanics of Interphase Breakdown

During fast charging, lithium ions ($\text{Li}^+$) migrate across the solid electrolyte interface. High electric field gradients create local mechanical stresses ($\mathbf{\sigma}$) at the interphase boundary:

1. **Passivation Layer Equilibrium ($\text{LiF}$)**: High electronic resistance and low mechanical stress ($\sigma \approx 0.12\text{ GPa} \le 0.4\text{ GPa}$) result in stable interphase passivation.
2. **Solvation Shell Breakdown ($\text{Li}^+$-EC Complex)**: Extreme local electric fields cause electrolyte decomposition, driving interphase stress above the yield limit ($\sigma \ge 0.4\text{ GPa}$).
3. **Micro-Crack & Dendrite Nucleation**: High Virial stress fractures the brittle inorganic SEI, creating micro-channels where metallic lithium deposits at high velocity ($v_{\text{dendrite}} \ge 0.75\text{ Å/ps}$), leading to internal short-circuits.

---

## 2. In-Silico Predictive Capability

HQFAST allows battery researchers to simulate these degradation steps computationally before building physical prototype cells:

```
[Molecule / Additive Selection] ──> [MPO-DMRG Electronic Ground State]
                                              │
                                              ▼
[E(3)-Equivariant Virial Stress] <── [Ab-Initio Nuclear Forces]
               │
               ▼
[2D Mechanical Stress Heatmap & Dendrite Growth Velocity Prediction]
```

By predicting SEI fracture thresholds *in-silico*, HQFAST enables rapid formulation of dendrite-resistant solid electrolytes and multi-component additive recipes.
