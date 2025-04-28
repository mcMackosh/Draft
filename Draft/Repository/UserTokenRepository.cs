//using Draft.Data.Model;
//using Microsoft.EntityFrameworkCore;
//using MyToDo.Models;
//using MyToDo.Repository.DTO;
//using MyToDo.Repository.IRepository;
//using System.Collections.Generic;
//using System.Linq;

//namespace MyToDo.Repository
//{
//    public class UsersTokenRepository : IUsersTokenRepository
//    {
//        private DBProjectManagerContext _context;

//        public UsersTokenRepository(DBProjectManagerContext context)
//        {
//            _context = context;
//        }

//        public RefreshToken? CreateOrUpdate(int userId, string token)
//        {
//            RefreshToken? userToken = _context.RefreshTokens.FirstOrDefault(x => x.UserId == userId);
//            if (userToken == null)
//            {
//                RefreshToken token = new RefreshToken();
//                token.UserId = userId;
//                user.RefreshTokens = token;
//                _context.RefreshTokens.Add(user);
//            }
//            else
//            {
//                userToken.UserId = userId;
//                userToken.RefreshToken = token;
//                _context.UserTokens.Update(userToken);
//            }

//            _context.SaveChanges();
//            return userToken;
//        }

//        public void Delete(UserToken user)
//        {
//            _context.UserTokens.Remove(user);
//            _context.SaveChanges();
//        }

//        public UserToken? Get(string token)
//        {
//            return _context.UserTokens.FirstOrDefault(x => x.RefreshToken == token);
//        }
//    }
//}