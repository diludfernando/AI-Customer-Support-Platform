using System.Threading.Tasks;
using AICustomerSupport.Backend.DTOs.Analytics;

namespace AICustomerSupport.Backend.Services.Interfaces;

public interface IAnalyticsService
{
    Task<AnalyticsSummaryDto> GetSummaryAsync();
}
