namespace ChatApp.Message.Features.VideoCall.Commands.JoinVideoRoom;

public record JoinVideoRoomCommand(int RoomId) : IRequest<JoinVideoRoomResponse>;