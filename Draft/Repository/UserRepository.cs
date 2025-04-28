//using Draft.Data.Model;
//using MyToDo.Repository.IRepository;

//namespace MyToDo.Repository
//{
//    public class UserRepository : IUserRepository
//    {
//        private DBProjectManagerContext _context;
//        public UserRepository(DBProjectManagerContext context)
//        {
//            _context = context;
//        }

//        public User? Registration(User user)
//        {
//            if (user != null)
//            {
//                _context.Users.Add(user);
//                _context.SaveChanges();

//                return user;
//            }
//            else return null;
//        }
//        public ICollection<User> GetAllUsers()
//        {
//            return _context.Users.OrderBy(p => p.Id).ToList();
//        }
//        public User? GetOneUserById(int id)
//        {
//            return _context.Users.FirstOrDefault(p => p.Id == id);
//        }
//        public User? FindByEmail(string email = "")
//        {
//            return _context.Users.FirstOrDefault(p => p.Email == email);
//        }
//        public bool SetVarification(User user)
//        {
//            user.IsVerified = true;
//            _context.SaveChanges();
//            return true;
//        }

//        //public User? ChangeInfo(User user)
//        //{
//        //    return null;
//        //}
//    }
//}
