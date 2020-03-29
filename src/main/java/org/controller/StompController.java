package org.controller;

import org.data.SimpleMessage;
import org.service.BroadCast;
import org.springframework.beans.factory.annotation.Autowired;
import org.data.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Controller;

import javax.crypto.MacSpi;
import java.security.Principal;

@Controller
public class StompController {
    private BroadCast broadCastTool;

    @Autowired
    public void setBroadCastTool(BroadCast arg) {
        this.broadCastTool = arg;
    }

    @MessageMapping("/message")
    @SendToUser("/queue/backmessage")
    public String HandleMessage(Principal principal, SimpleMessage SimpleMessage) {
        String author = principal.getName();
        Message message = new Message(author,SimpleMessage.getMsg());
        this.broadCastTool.BroadCastToUsers(message);
        return message.getMsg();
    }
}
