using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

[ApiController]
[Route("api/[controller]")]
public class CallController : ControllerBase
{
    private readonly IHubContext<SignalingHub> _hubContext;

    public CallController(IHubContext<SignalingHub> hubContext)
    {
        _hubContext = hubContext;
    }

    [HttpPost("offer")]
    public async Task<IActionResult> SendOffer([FromBody] OfferRequest request)
    {
        await _hubContext.Clients.Group(request.GroupId)
            .SendAsync("ReceiveOffer", request.SenderUserId, request.Offer);

        return Ok(new { Message = "Offer sent to group successfully" });
    }

    [HttpPost("answer")]
    public async Task<IActionResult> SendAnswer([FromBody] AnswerRequest request)
    {
        await _hubContext.Clients.Group(request.GroupId)
            .SendAsync("ReceiveAnswer", request.SenderUserId, request.Answer);

        return Ok(new { Message = "Answer sent to group successfully" });
    }

    [HttpPost("ice-candidate")]
    public async Task<IActionResult> SendIceCandidate([FromBody] IceCandidateRequest request)
    {
        await _hubContext.Clients.Group(request.GroupId)
            .SendAsync("ReceiveIceCandidate", request.SenderUserId, request.Candidate);

        return Ok(new { Message = "ICE Candidate sent to group successfully" });
    }
}

public class OfferRequest
{
    public string GroupId { get; set; } = string.Empty;
    public string SenderUserId { get; set; } = string.Empty;
    public string Offer { get; set; } = string.Empty;
}

public class AnswerRequest
{
    public string GroupId { get; set; } = string.Empty;
    public string SenderUserId { get; set; } = string.Empty;
    public string Answer { get; set; } = string.Empty;
}

public class IceCandidateRequest
{
    public string GroupId { get; set; } = string.Empty;
    public string SenderUserId { get; set; } = string.Empty;
    public string Candidate { get; set; } = string.Empty;
}

public class GroupRequest
{
    public string GroupId { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string ConnectionId { get; set; } = string.Empty;
}
