// async getUserConversations(userId: number): Promise<Conversation[]> {
//     const userConversations = await this.prisma.user.findUnique({
//       where: { id: userId },
//       include: {
//         conversations: {
//           include: {
//             participants: true,
//             messages: true,
//           },
//         },
//       },
//     });

//     return userConversations.conversations;
//   }

//   // Implementação de Filtrar Conversas Mais Recentes
//   async getRecentConversations(userId: number): Promise<Conversation[]> {
//     const userConversations = await this.prisma.user.findUnique({
//       where: { id: userId },
//       include: {
//         conversations: {
//           include: {
//             participants: true,
//             messages: {
//               orderBy: { creationDate: 'desc' }, // Ordenar mensagens por data decrescente
//             },
//           },
//         },
//       },
//     });

//     return userConversations.conversations;
//   }