package org.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
public class StompController {
    @MessageMapping("/message")
    public void HandleMessage() {

    }
}
