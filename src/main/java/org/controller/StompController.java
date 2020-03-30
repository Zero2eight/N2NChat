package org.controller;

import org.data.SimpleMessage;
import org.service.BroadCast;
import org.springframework.beans.factory.annotation.Autowired;
import org.data.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class StompController {
    private BroadCast broadCastTool;

    @Autowired
    public void setBroadCastTool(BroadCast arg) {
        this.broadCastTool = arg;
    }

    @MessageMapping("/message")
    public void HandleMessage(Principal principal, SimpleMessage SimpleMessage) throws Exception
    {
        String author = principal.getName();
        Message message = new Message(author,SimpleMessage.getMsg());
        this.broadCastTool.BroadCastToUsers(message);
    }
}
