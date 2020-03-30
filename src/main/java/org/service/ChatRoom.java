package org.service;

import org.springframework.stereotype.Component;

import java.util.HashSet;

@Component
public class ChatRoom {
    private HashSet<String> roomMember;

    public ChatRoom(String... userList) {
        this.roomMember = new HashSet<>();
        for (String u: userList) {
            roomMember.add(u);
        }
    }

    public void addMember(String username) {
        roomMember.add(username);
    }

    public String[] getMember() {
        String[] retList = new String[roomMember.size()];
        int index=0;
        for (String user : roomMember) {
            retList[index] = user;
            index++;
        }
        return retList;
    }
}
