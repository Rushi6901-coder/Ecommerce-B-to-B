using Microsoft.AspNetCore.SignalR;

public class ChatHub : Hub
{
    public async Task JoinChatRoom(string chatRoomId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, chatRoomId);
    }
}
