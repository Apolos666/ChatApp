global using ChatApp.Message.Models;
global using ChatApp.Message.Data;
global using ChatApp.Message.Extensions;
global using ChatApp.Message.Middleware;
global using ChatApp.Message.Options;
global using Microsoft.AspNetCore.Authentication.JwtBearer;
global using Microsoft.IdentityModel.Tokens;
global using Microsoft.EntityFrameworkCore;
global using MediatR;
global using Carter;
global using Microsoft.AspNetCore.SignalR;
global using ChatApp.Message.Features.Messages.Commands;
global using ChatApp.Message.Features.Messages.Hubs;
global using ChatApp.Message.Features.Messages.Models;
global using Microsoft.Extensions.Options;
global using System.Text.Json;
global using Confluent.Kafka;
global using Microsoft.AspNetCore.Diagnostics;
global using ChatApp.Message.Infrastructure.ExceptionHandlers;
global using Microsoft.AspNetCore.Authorization;
global using Confluent.Kafka.Admin;
global using ChatApp.Message.Features.Common.Behaviors;
global using FluentValidation;
global using Microsoft.AspNetCore.Mvc;
global using CloudinaryDotNet;
global using CloudinaryDotNet.Actions;
global using ChatApp.Message.Features.Messages.Contracts.Requests;
global using Features.Messages.Queries.GetMessages;
global using ChatApp.Message.Features.Messages.Contracts.Responses;
global using ChatApp.Message.Features.Rooms.Dtos;
global using ChatApp.Message.Features.Messages.Dtos;
global using ChatApp.Message.Services.Cloudinary;
global using ChatApp.Message.Features.Messages.Commands.PinMessage;
global using ChatApp.Message.Features.Messages.Commands.UnpinMessage;
global using ChatApp.Message.Features.Messages.Commands.SendMessage;
global using ChatApp.Message.Features.Messages.Kafka.Interfaces;
global using ChatApp.Message.Features.Messages.Kafka.Consumers;
global using ChatApp.Message.Features.Messages.Kafka.Producers;
global using Features.Messages.Kafka.Consumers;
global using Web.Services.Kafka.Consumers;
global using ChatApp.Message.Infrastructure.RTC;
global using ChatApp.Message.Features.Messages.Dtos.VideoCall;
global using ChatApp.Message.Features.VideoCall.Hubs;
global using ChatApp.Message.Infrastructure.SignalR;
global using ChatApp.Message.Features.Messages.Services;
global using Microsoft.Extensions.Caching.Memory;















