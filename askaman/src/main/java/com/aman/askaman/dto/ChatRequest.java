package com.aman.askaman.dto;

public record ChatRequest(
        String question,
        String mode,
        String contactPurpose
) {
}