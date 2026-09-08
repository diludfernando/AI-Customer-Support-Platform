using System.Collections.Generic;

namespace AICustomerSupport.Backend.DTOs.Analytics;

public class AnalyticsSummaryDto
{
    public int TotalTickets { get; set; }
    public int OpenTickets { get; set; }
    public int InProgressTickets { get; set; }
    public int ResolvedTickets { get; set; }
    public double AiResolvedPercent { get; set; }
    public int AvgResponseTimeSec { get; set; }
    public double CsatScore { get; set; }
    public double EscalationRate { get; set; }
}
