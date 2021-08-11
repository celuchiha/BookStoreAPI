
using System;
using System.Collections.Generic;
using System.Linq;

namespace Bookstore.Api.Data
{
    /// <summary>
    /// Seeds the database with demo data.
    /// </summary>
    public class DbInitializer
    {
        public static void Initialize(BookstoreContext context)
        {
            context.Database.EnsureCreated();

            // Look for any books
            if (context.BookSet.Any())
            {
                return; // DB has been seeded
            }

            // Create some languages.
            context.LanguageSet.AddRange(
                new Language() { IsoName = "English", IsoCode = "en" },
                new Language() { IsoName = "Spanish", IsoCode = "es" },
                new Language() { IsoName = "Dutch", IsoCode = "nl" },
                new Language() { IsoName = "French", IsoCode = "fr" },
                new Language() { IsoName = "German", IsoCode = "de" },
                new Language() { IsoName = "Italian", IsoCode = "it" }
            );
            context.SaveChanges();

            // Create some categories.
            context.CategorySet.AddRange(
                new Category() { Name = "Programming", Description = "All about programming" }
            );
            context.SaveChanges();

            // Create some books with authors.            
            var language = context.LanguageSet.First();
            var category = context.CategorySet.First();

            context.BookSet.AddRange(
                  new Book()
                {
                    Title = "Clean Code: A Handbook of Agile Software Craftsmanship",
                    Language = language,
                    Category = category,
                    ISBN = " 978-0132350884",
                    Authors = new List<Author>()
                    {
                        new Author() { FirstName = "Robert C.", LastName = "Martin", About = "Robert Cecil Martin (colloquially known as Uncle Bob) is an American software engineer and author. He is a co-author of the Agile Manifesto."}
                    }.Select(CreateBookAuthor).ToList()
                },
                new Book()
                {
                    Title = "Design Patterns: Elements of Reusable Object-Oriented Software",
                    Language = language,
                    Category = category,
                    ISBN = "978-0201633610",
                    Authors = new List<Author>()
                    {
                        new Author() { FirstName = "Erich", LastName = "Gamma", About = "Erich Gamma (born 1961 in Zürich) is a Swiss computer scientist and co-author of the influential software engineering textbook, Design Patterns: Elements of Reusable Object-Oriented Software." },
                        new Author() { FirstName = "John", LastName = "Vlissides", About = "John Matthew Vlissides (August 2, 1961 - November 24, 2005) was a software scientist known mainly as one of the four authors (referred to as the Gang of Four) of the book Design Patterns: Elements of Reusable Object-Oriented Software." }
                    }.Select(CreateBookAuthor).ToList()
                },
                new Book()
                {
                    Title = "Domain-Driven Design: Tackling Complexity in the Heart of Software",
                    Language = language,
                    Category = category,
                    ISBN = "978-0321125217",
                    Authors = new List<Author>()
                    {
                        new Author() { FirstName = "Eric", LastName = "Evans", About = "Eric Evans is a thought leader in software design and domain modeling. The founder of Domain Language and author of Domain-Driven Design, he recently founded a modeling community where those interested in domain modeling can come together to learn and discuss effective practices. He’s worked on successful Java and Smalltalk projects in fields including finance, shipping, insurance, and manufacturing automation."}
                    }.Select(CreateBookAuthor).ToList()
                },
                new Book()
                {
                    Title = "JavaScript: The Good Parts",
                    Language = language,
                    Category = category,
                    ISBN = "978-0596517748",
                    Authors = new List<Author>()
                    {
                        new Author() { FirstName = "Douglas", LastName = "Crockford", About = "Douglas Crockford is a Senior JavaScript Architect at Yahoo!, well known for introducing and maintaining the JSON (JavaScript Object Notation) format."}
                    }.Select(CreateBookAuthor).ToList()
                },
           
                new Book()
                {
                    Title = "Working Effectively with Legacy Code",
                    Language = language,
                    Category = category,
                    ISBN = "978-0131177055",
                    Authors = new List<Author>()
                    {
                        new Author() { FirstName = "Michael", LastName = "Feathers"}
                    }.Select(CreateBookAuthor).ToList()
                }
            );
            context.SaveChanges();
        }

        private static BookAuthor CreateBookAuthor(Author author)
        {
            return new BookAuthor() { Author = author };
        }
    }
}