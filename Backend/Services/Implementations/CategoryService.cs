using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AICustomerSupport.Backend.Data;
using AICustomerSupport.Backend.DTOs.Categories;
using AICustomerSupport.Backend.Models;
using AICustomerSupport.Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AICustomerSupport.Backend.Services.Implementations;

public class CategoryService : ICategoryService
{
    private readonly ApplicationDbContext _context;

    public CategoryService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<CategoryDto>> GetAllCategoriesAsync()
    {
        var categories = await _context.Categories.AsNoTracking().ToListAsync();
        return categories.Select(c => new CategoryDto
        {
            Id = c.Id,
            Name = c.Name,
            Description = c.Description
        }).ToList();
    }

    public async Task<CategoryDto?> GetCategoryByIdAsync(Guid id)
    {
        var c = await _context.Categories.FindAsync(id);
        return c == null ? null : new CategoryDto
        {
            Id = c.Id,
            Name = c.Name,
            Description = c.Description
        };
    }

    public async Task<CategoryDto> CreateCategoryAsync(CreateCategoryDto createDto)
    {
        var category = new Category
        {
            Id = Guid.NewGuid(),
            Name = createDto.Name,
            Description = createDto.Description,
            CreatedAt = DateTime.UtcNow
        };

        await _context.Categories.AddAsync(category);
        await _context.SaveChangesAsync();

        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description
        };
    }
}
