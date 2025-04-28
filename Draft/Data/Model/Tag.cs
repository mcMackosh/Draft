namespace Draft.Data.Model
{
    public class Tag
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Color { get; set; }
        public int ProjectId { get; set; }
        public Project Project { get; set; }
    }
}