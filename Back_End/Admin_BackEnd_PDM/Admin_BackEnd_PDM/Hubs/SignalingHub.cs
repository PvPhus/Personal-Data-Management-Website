using Microsoft.AspNetCore.SignalR;

public class SignalingHub : Hub
{
    // Map user_id to connectionId
    private static readonly Dictionary<string, string> UserConnections = new();

    // Map group_id to list of user_ids
    private static readonly Dictionary<string, HashSet<string>> Groups = new();

    public async Task SendOffer(string groupId, string senderUserId, string offer)
    {
        if (Groups.TryGetValue(groupId, out var groupMembers))
        {
            foreach (var userId in groupMembers)
            {
                if (userId != senderUserId && UserConnections.TryGetValue(userId, out var connectionId))
                {
                    await Clients.Client(connectionId).SendAsync("ReceiveOffer", senderUserId, offer);
                }
            }
        }
    }

    public async Task SendAnswer(string groupId, string senderUserId, string answer)
    {
        if (Groups.TryGetValue(groupId, out var groupMembers))
        {
            foreach (var userId in groupMembers)
            {
                if (userId != senderUserId && UserConnections.TryGetValue(userId, out var connectionId))
                {
                    await Clients.Client(connectionId).SendAsync("ReceiveAnswer", senderUserId, answer);
                }
            }
        }
    }

    public async Task SendIceCandidate(string groupId, string senderUserId, string candidate)
    {
        if (Groups.TryGetValue(groupId, out var groupMembers))
        {
            foreach (var userId in groupMembers)
            {
                if (userId != senderUserId && UserConnections.TryGetValue(userId, out var connectionId))
                {
                    await Clients.Client(connectionId).SendAsync("ReceiveIceCandidate", senderUserId, candidate);
                }
            }
        }
    }

    public override Task OnConnectedAsync()
    {
        var userId = Context.GetHttpContext()?.Request.Query["user_id"].ToString();
        if (!string.IsNullOrEmpty(userId))
        {
            UserConnections[userId] = Context.ConnectionId;
        }

        Console.WriteLine($"User {userId} connected with ConnectionId {Context.ConnectionId}");
        return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = UserConnections.FirstOrDefault(x => x.Value == Context.ConnectionId).Key;
        if (userId != null)
        {
            UserConnections.Remove(userId);

            // Remove user from all groups
            foreach (var group in Groups.Values)
            {
                group.Remove(userId);
            }
        }

        Console.WriteLine($"User {userId} disconnected.");
        return base.OnDisconnectedAsync(exception);
    }
}
