package org.data;

import java.text.SimpleDateFormat;
import java.util.Date;

public class Message {
    private String author,msg;
    private Date publishTime;
    public Message(String author, String msg) {
        this.author = author;
        this.msg = msg;
        this.publishTime = new Date();
    }

    public String getAuthor() {
        return author;
    }

    public String getMsg() {
        return msg;
    }

    public String getPublishTime() {
        SimpleDateFormat ft = new SimpleDateFormat ("yyyy-MM-dd hh:mm:ss");
        String formatPublishTime = ft.format(this.publishTime);
        return formatPublishTime;
    }
}
