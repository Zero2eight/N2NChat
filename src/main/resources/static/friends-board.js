var FBStompDealer = new stompDealer("/queue/members","/app/members");
function afterReceived(received) {
    console.log(received)
}
FBStompDealer.setAfterReceived(afterReceived);
FBStompDealer.connect();
FBStompDealer.sendTo({order:"requestMember"})

var friendEntry = {
    props:{
        member:String,
    },
    template:`
    <div>
        <p>{{ memeber }}</p>
    </div>
    `
}


var friendsBoard = {
    data:function() {
        return {
            friendList:globalFriendList,
        }
    },
    template:`
    <div>
    <p>Online members</p>
    <table>
        <tr v-for="fr in friendList">
            <td>
                <friendEntry v-bind:member="fr"></friendEntry>
            </td>
        </tr>
    </table>
    </div>
    `,
    components:{
        'friendEntry':friendEntry,
    }
}
