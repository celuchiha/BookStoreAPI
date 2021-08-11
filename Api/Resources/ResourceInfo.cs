namespace Bookstore.Api.Resources
{
    /// <summary>
    /// Contains information about a resource in the REST API. Used to describe links between resources.
    /// </summary>
    public class ResourceInfo
    {
        /// <summary>
        /// The unique id of the resource.
        /// </summary>        
        public int Id {get; set;}

        /// <summary>
        /// A short display name of the resource.
        /// </summary>        
        public string DisplayName {get; set;}

        public ResourceInfo(int id, string displayName)
        {
            Id = id;
            DisplayName = displayName;
        }

        public ResourceInfo() {}
    }
}