namespace Draft.Data.Model
{
    public class UserInfo
    {
        public int UserId { get; set; }
        public User User { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Phone { get; set; }
        public string Country { get; set; }
    }
}