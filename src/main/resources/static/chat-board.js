function cutUrl(str,n=1) {
    temp = str
    while (n>0) {
        temp = temp.slice(0,temp.lastIndexOf("/"));
        n-=1;
    }
    return temp;
}

class stompDealer {
    //subscribedbroker：String，订阅的代理地址
    //connectLocation：String，建立连接的websocket地址
    constructor(subscribedbroker,sendToLocation,connectLocation='/chatwebsocket') {
        this.base = cutUrl(document.location.href);
        console.log(this.base+connectLocation);
        this.socket = new SockJS(this.base+connectLocation);
        this.stompClient = Stomp.over(this.socket);
        console.log(this.stompClient);
        this.subscribedbroker = subscribedbroker;
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
        var AfterConnect = (frame)=>{
            console.log("my stomp client: "+this.stompClient);
            this.stompClient.subscribe(this.subscribedbroker,this.afterReceived)
        }
        AfterConnect = AfterConnect.bind(this);
        this.stompClient.connect({},AfterConnect);
    }

    sendTo(Obj) {
        this.stompClient.send(this.sendToLocation,{},JSON.stringify(Obj));
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
    constructor(date, author, msg) {
        this.date=date;
        this.author=author;
        this.msg=msg;
    }
}

var globalStompDealer = new stompDealer("/user/queue/backmessage","/app/message");
//注意：发送信息的逻辑为：
//本客户端其它对象、方法一律不直接修改此globalAllMessages对象，
//全权交给stompDealer中的回调函数处理。
var globalAllMessages = [];
function afterReceived(received) {
    console.log("executing afterReceived");
    obj = JSON.parse(received.body);
    globalAllMessages.push(new Message(obj.date, obj.auther, obj.msg));
}
globalStompDealer.setAfterReceived(afterReceived);
globalStompDealer.connect();

var messageTag = {
    props:{
        date:String,
        author:String,
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
            allMessages:globalAllMessages,
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
                <td>{{ message.author }}</td>
                <td>
                    <message-entry v-bind:date="message.date" v-bind:author="message.author"
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

var operatePanel = {
    data: function() {
        return {
            msg:"",
            stompDealer:globalStompDealer,
        };
    },
    methods: {
        sendMessage:function() {
            this.stompDealer.sendTo({msg:this.msg});
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
        "operate-panel":operatePanel,
    },
    template:`
    <div>
        <message-container ></message-container>
        <operate-panel></operate-panel>
    </div>
    `
}


