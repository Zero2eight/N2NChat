var head= document.getElementsByTagName('head')[0];
var sockScript= document.createElement('script');
sockScript.type= 'text/javascript';
sockScript.src= 'https://cdn.bootcss.com/sockjs-client/1.4.0/sockjs.min.js';
head.appendChild(sockScript);
var stompScript = document.createElement('script');
stompScript.type = 'text/javascript';
sockScript.src = "https://cdn.bootcss.com/stomp.js/2.3.3/stomp.min.js";
head.appendChild(stompScript);


class stompDealer {
    //subscribedbroker：String，订阅的代理地址
    //connectLocation：String，建立连接的websocket地址
    constructor(subscribedbroker,sendToLocation,connectLocation='chatwebsocket') {
        this.base = document.location.href;
        this.socket = new SockJs(base+connectLocation);
        this.stompClient = Stomp.over(this.socket);
        this.subscribedbroker = subscribedbroker;
        this.afterReceived = afterReceived;
        this.sendToLocation = sendToLocation;
    }

    //fun：function，收到消息之后的动作
    setAfterReceived(fun) {
        this.afterReceived = fun;
    }

    //fun：function，发送信息之后的动作
    setAfterSend(fun) {
        this.AfterSend = fun;
    }

    connect() {
        this.stompClient.connect({},function(frame){
            stompClient.subscribe(this.subscribedbroker,this.afterReceived)
        })
    }

    sendTo(Obj) {
        this.stompClient.send(sendToLocation,{},JSON.stringify(Obj));
        if (this.AfterSend != null) {
            this.AfterSend();
        }
    }

    disconnect() {
        if(this.stompClient !== null) {
            this.stompClient.disconnect();
        }
    }
}

//一个信息的模型
class Message {
    constructor(date, auther, msg) {
        this.date=date;
        this.auther=auther;
        this.msg=msg;
    }
}

var globalStompDealer = new stompDealer("/topic/greeting","/app/hello");
//注意：发送信息的逻辑为：
//本客户端其它对象、方法一律不直接修改此globalAllMessages对象，
//全权交给stompDealer中的回调函数处理。
var globalAllMessages = [];
function afterReceived(received) {
    obj = JSON.parse(received.body);
    globalAllMessages.push(new Message(obj.date, obj.auther, obj.msg));
}

var messageTag = {
    props:{
        date:String,
        auther:String,
        msg:String,
    },
    template:`
    <div>
        <p>{{ date }}</p>
        <p>{{ msg }}</p>
    </div>
    `,
}

var messageContainer = {
    data: function() {
        return {
            allMessages=globalAllMessages,
            stompDealer:globalStompDealer,
        };
    },
    components:{
        "message-entry":messageTag,
    },
    template:`
    <div>
        <table>
            <tr v-for="message in allMessages">
                <td>{{ message.auther }}</td>
                <td>
                    <message-entry v-bind:date="message.date" v-bind:auther="message.auther"
                    v-bind:message="message.msg">
                    </message-entry>
                </td>
            <tr>
        </table>
    </div>
    `,
    methods:{
        addMessage:function (message) {
            this.message.push(message);
        }
    }
}

var operatePannel = {
    data: function() {
        return {
            msg:"",
            stompDealer:glocbalStompDealer,
        };
    },
    method: {
        sendMessage:function() {
            this.globalStompDealer.sendTo({msg:this.msg});
        }
    },
    template: `
    <div>
        <input v-model='msg' placeholder="Input next message to send" type="text" />
        <button v-on:click="sendMessage">Send Message</button>
    </div>
    `
}

var chatBoard = {
    components: {
        "message-container":messageContainer,
        "operate-pannel":operatePannel,
    },
    template:`
    <div>
        <message-container ></message-container>
        <operate-pannel></operate-pannel>
    </div>
    `
}


