/*
* This code was generated by a Yellicode template.
* 
* Changes to this file may cause incorrect behavior and will be lost if the code is regenerated.
*/
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Bookstore.Api.Data;
using Bookstore.Api.Resources;

namespace Bookstore.Api.Controllers
{
	[Route("api/category")]
	public partial class CategoryController : Controller
	{
		private readonly BookstoreContext _dbContext;
		private readonly ResourceMapper _resourceMapper;

		public CategoryController(BookstoreContext dbContext)
		{
			_dbContext = dbContext;
			_resourceMapper = new ResourceMapper(dbContext);
		}

		[HttpGet]
		public IEnumerable<CategoryResource> GetAll()
		{
			return _dbContext.CategorySet
				.Select(_resourceMapper.ToCategoryResource)
				.ToList();
		}

		[HttpGet("options")]
		public IEnumerable<ResourceInfo> GetAllOptions()
		{
			return _dbContext.CategorySet
				.Select(e => new ResourceInfo(e.Id, e.GetDisplayName()))
				.ToList();
		}

		[HttpGet("{id}", Name = "GetCategory")]
		public IActionResult GetById(int id)
		{
			var entity = _dbContext.CategorySet
				.FirstOrDefault(e => e.Id == id);

			if (entity == null) { return NotFound(); }
			return new ObjectResult(_resourceMapper.ToCategoryResource(entity));
		}

		[HttpPost]
		public IActionResult Create([FromBody] CategoryResource resource)
		{
			if (resource == null) { return BadRequest(); }
			var entity = _resourceMapper.ToCategory(resource);
			_dbContext.CategorySet.Add(entity);
			_dbContext.SaveChanges();
			return CreatedAtRoute("GetCategory", new { id = entity.Id }, resource);
		}

		[HttpPut("{id}")]
		public IActionResult Update(int id, [FromBody] CategoryResource resource)
		{
			if (resource == null || resource.Id != id) { return BadRequest(); }
			var entity = _dbContext.CategorySet
				.FirstOrDefault(e => e.Id == id);

			if (entity == null) { return NotFound(); }

			_resourceMapper.ToCategory(entity, resource);

			_dbContext.CategorySet.Update(entity);
			_dbContext.SaveChanges();
			return new NoContentResult();
		}

		[HttpDelete("{id}")]
		public IActionResult Delete(int id)
		{
			var entity = _dbContext.CategorySet.FirstOrDefault(e => e.Id == id);
			if (entity == null) { return NotFound(); }

			_dbContext.CategorySet.Remove(entity);
			_dbContext.SaveChanges();
			return new NoContentResult();
		}
	}
}
