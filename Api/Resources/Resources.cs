/*
* This code was generated by a Yellicode template.
* 
* Changes to this file may cause incorrect behavior and will be lost if the code is regenerated.
*/
using System;
using System.Collections.Generic;

namespace Bookstore.Api.Resources
{
	/// <summary>
	/// The Author class represents a single book author.
	/// </summary>
	public class AuthorResource
	{

		/// <summary>
		/// Gets the unique id of this Author.
		/// </summary>
		public int Id { get; set; }

		/// <summary>
		/// The author's first name.
		/// </summary>
		public string FirstName { get; set; }

		/// <summary>
		/// The author's last name.
		/// </summary>
		public string LastName { get; set; }

		/// <summary>
		/// Contains a short introductory text about the author.
		/// </summary>
		public string About { get; set; }
		/// <summary>
		/// Gets the display name of this AuthorResource. This property is generated.
		/// </summary>
		public string DisplayName {get; set;}
	}

	/// <summary>
	/// The Book class represents a book that is for sale in our bookstore.
	/// </summary>
	public class BookResource
	{

		/// <summary>
		/// Gets the unique id of this Book.
		/// </summary>
		public int Id { get; set; }

		/// <summary>
		/// The book title.
		/// </summary>
		public string Title { get; set; }

		/// <summary>
		/// Lists one or more authors the book was written by.
		/// </summary>
		public ICollection Authors {get; set;}

		/// <summary>
		/// The category that this book belongs to.
		/// </summary>
		public ResourceInfo Category {get; set;}

		/// <summary>
		/// The language the book is written in.
		/// </summary>
		public ResourceInfo Language {get; set;}

		/// <summary>
		/// Contains the book's ISBN-13 code.
		/// </summary>
		public string ISBN { get; set; }
		/// <summary>
		/// Gets the display name of this BookResource. This property is generated.
		/// </summary>
		public string DisplayName {get; set;}
	}

	/// <summary>
	/// We use categories to organize our books. A book can only belong to a single category.
	/// </summary>
	public class CategoryResource
	{

		/// <summary>
		/// Gets the unique id of this Category.
		/// </summary>
		public int Id { get; set; }

		/// <summary>
		/// The name of the category.
		/// </summary>
		public string Name { get; set; }

		/// <summary>
		/// The description of the category.
		/// </summary>
		public string Description { get; set; }
		/// <summary>
		/// Gets the display name of this CategoryResource. This property is generated.
		/// </summary>
		public string DisplayName {get; set;}
	}

	/// <summary>
	/// Defines all possible languages that books might be written in.
	/// </summary>
	public class LanguageResource
	{

		/// <summary>
		/// Gets the unique id of this Language.
		/// </summary>
		public int Id { get; set; }

		/// <summary>
		/// The ISO 639-2 language code.
		/// </summary>
		public string IsoCode { get; set; }

		/// <summary>
		/// The ISO language name.
		/// </summary>
		public string IsoName { get; set; }
		/// <summary>
		/// Gets the display name of this LanguageResource. This property is generated.
		/// </summary>
		public string DisplayName {get; set;}
	}

}
