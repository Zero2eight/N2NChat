package org.service;

import org.data.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.user.UserDestinationMessageHandler;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

//used for broadcast message to specific user
@Service
public class BroadCast {
    private SimpMessagingTemplate sendTool;
    private ChatRoom chatRoom;

    @Autowired
    public void setSendTool(SimpMessagingTemplate aSendTool) {
        this.sendTool = aSendTool;
    }

    @Autowired
    public void setChatRoom(ChatRoom aChatRoom) {
        this.chatRoom = aChatRoom;
    }

    public ChatRoom getChatRoom()
    {
        return this.chatRoom;
    }

    public void BroadCastToUsers(Object payload) {
        for (String user : chatRoom.getMember())
        {
            sendTool.convertAndSendToUser(
                user,"/queue/backmessage", payload
            );
        }
    }

    public void BroadCastChatRoomMMembers() {
        sendTool.convertAndSend("/queue/members",chatRoom.getMember());
    }
}
