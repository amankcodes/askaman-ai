package com.aman.askaman.controller;

import com.aman.askaman.dto.ChatRequest;
import com.aman.askaman.dto.ChatResponse;
import com.aman.askaman.service.EmailService;
import com.aman.askaman.service.GeminiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class ChatController {

    private final GeminiService geminiService;
    private final EmailService emailService;
    private final Set<String> notifiedContactRequests =
            ConcurrentHashMap.newKeySet();

    public ChatController(
            GeminiService geminiService,
            EmailService emailService) {

        this.geminiService = geminiService;
        this.emailService = emailService;
    }

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(
            @RequestBody ChatRequest request) {

        if (request.question() == null ||
                request.question().isBlank()) {

            return ResponseEntity.badRequest()
                    .body(new ChatResponse(
                            "Please enter a question.",
                            false
                    ));
        }

        String question = request.question().trim();

        /*
         * Contact request flow
         */
        if (isContactRequest(question)) {

            if (request.contactPurpose() == null ||
                    request.contactPurpose().isBlank()) {

                return ResponseEntity.ok(
                        new ChatResponse(
                                """
                                Sure. What would you like to connect with Aman about?

                                • Job opportunity / hiring
                                • HR or recruiter discussion
                                • Interview / hiring process
                                • Collaboration / project discussion
                                • Other professional inquiry

                                You can simply tell me the purpose in your own words.
                                """,
                                false
                        )
                );
            }

            String purpose = request.contactPurpose().trim();

            String answer = """
                    Sure. You can contact Aman directly:

                    Mobile: +91 8252363485
                    Email: amankr1705@gmail.com

                    I've also notified Aman that someone is trying to connect with him regarding: %s
                    """.formatted(purpose);

            try {

                String notificationKey =
                        purpose.toLowerCase().trim()
                                + "|" +
                                question.toLowerCase().trim();

                boolean shouldNotify =
                        notifiedContactRequests.add(notificationKey);

                if (shouldNotify) {

                    emailService.sendContactNotification(
                            purpose,
                            question
                    );
                }

                return ResponseEntity.ok(
                        new ChatResponse(answer, shouldNotify)
                );

            } catch (Exception e) {

                e.printStackTrace();

                return ResponseEntity.ok(
                        new ChatResponse(
                                """
                                You can contact Aman directly:

                                Mobile: +91 8252363485
                                Email: amankr1705@gmail.com

                                I couldn't send the notification to Aman right now, but his contact details above are valid.
                                """,
                                false
                        )
                );
            }
        }

        /*
         * Normal AI conversation
         */
        String answer =
                geminiService.ask(question);

        return ResponseEntity.ok(
                new ChatResponse(answer, false)
        );
    }

    private boolean isContactRequest(String question) {

        String q = question.toLowerCase();

        return q.contains("contact aman")
                || q.contains("contact him")
                || q.contains("contact details")
                || q.contains("contact information")
                || q.contains("phone number")
                || q.contains("mobile number")
                || q.contains("phone")
                || q.contains("mobile")
                || q.contains("email id")
                || q.contains("email address")
                || q.contains("email")
                || q.contains("how can i contact")
                || q.contains("how do i contact")
                || q.contains("reach aman")
                || q.contains("reach him");
    }
}