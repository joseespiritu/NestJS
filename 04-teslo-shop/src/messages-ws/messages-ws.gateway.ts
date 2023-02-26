import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesWsService } from './messages-ws.service';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/interfaces';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService
  ) { }

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token);
      await this.messagesWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }

    // console.log({ payload });
    // console.log('Cliente conectado', client.id);
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
  }

  handleDisconnect(client: Socket) {
    // console.log('Cliente desconectado', client.id);
    this.messagesWsService.removeClient(client.id);
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
  }

  @SubscribeMessage('message-form-client')
  onMessageFromCLient(client: Socket, payload: NewMessageDto) {

    // * Solo recibe el cliente que emitio el mensaje
    // ! Emite únicamente al cliente
    // client.emit('message-from-server', {
    //   fullName: 'Soy YO!',
    //   message: payload.message || 'no message!!'
    // });

    // * El mensaje es recibido por todos, menos quien lo emitio
    // ! Emitir a todos MENOS al cliente inicial
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Soy YO!',
    //   message: payload.message || 'no message!!'
    // });


    // * El mensaje es recibido por todos
    // ! Emitir a todos
    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullNameBySocketID(client.id),
      message: payload.message || 'no message!!'
    });

  }

}
