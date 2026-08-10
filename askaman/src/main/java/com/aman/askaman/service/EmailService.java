package com.aman.askaman.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${contact.notify.email}")
    private String amanEmail;

    @Value("${spring.mail.username}")
    private String senderEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendContactNotification(
            String purpose,
            String visitorMessage) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(senderEmail);
        message.setTo(amanEmail);

        message.setSubject(
                "AskAman Contact Request - " + purpose
        );

        String body = """
                Someone is trying to connect with you through AskAman.

                Contact Purpose:
                %s

                Visitor Message:
                %s

                This request was submitted through the AskAman
                professional portfolio.

                Please follow up with the visitor using your
                professional contact details.
                """.formatted(
                purpose,
                visitorMessage
        );

        message.setText(body);

        mailSender.send(message);
    }
}