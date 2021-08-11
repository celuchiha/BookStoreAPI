namespace Bookstore.Api.Data
{
    public interface IEntity
    {
        /// <summary>
        /// Gets the unique id of this entity.
        /// </summary>        
        int Id { get; }
    }
}