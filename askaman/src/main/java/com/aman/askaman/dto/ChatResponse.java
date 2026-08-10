package com.aman.askaman.dto;

public record ChatResponse(
        String answer,
        boolean contactRequested
) {
}