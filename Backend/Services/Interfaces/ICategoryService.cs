using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AICustomerSupport.Backend.DTOs.Categories;

namespace AICustomerSupport.Backend.Services.Interfaces;

public interface ICategoryService
{
    Task<List<CategoryDto>> GetAllCategoriesAsync();
    Task<CategoryDto?> GetCategoryByIdAsync(Guid id);
    Task<CategoryDto> CreateCategoryAsync(CreateCategoryDto createDto);
}
