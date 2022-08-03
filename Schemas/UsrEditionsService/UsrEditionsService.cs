namespace PublishingOffice.EditionsService
{
    using System;
    using System.ServiceModel;
    using System.ServiceModel.Activation;
    using System.ServiceModel.Web;
    using Terrasoft.Core.DB;
    using Terrasoft.Core.Entities;
    using Terrasoft.Web.Common;
    using PublishingOffice.ConfigurationConstants;

    [ServiceContract]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
    public class UsrEditionsService : BaseService
    {
        /// <summary>
        /// Получение общее колличество изданий
        /// </summary>
        /// <param name="code"> Код издания</param>
        /// <returns></returns>
        /// <exception cref="ArgumentException"></exception>
        [OperationContract]
        [WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.Wrapped,
        ResponseFormat = WebMessageFormat.Json)]
        public double GetEditionsPlannedByCode(string code)
        {
            if (string.IsNullOrEmpty(code))
            {
                throw new ArgumentNullException($"Parameter {nameof(code)} cannot be null");
            }
            
            return GetTotalSumOfEditionsByCode(code);
        }

        /// <summary>
        /// Получить общее колличество запланированых изданий
        /// </summary>
        /// <param name="code">Код издания</param>
        /// <returns>Общее колличество запланированых изданий</returns>
        public double GetTotalSumOfEditionsByCode(string code)
        {
                var selectSum = new Select(UserConnection)
                  .Column(Func.Count("Detail", "Id"))
                  .From("UsrPublicationDetail").As("Detail")
                      .InnerJoin("UsrPeriodicalEditions").As("Chapter")
                      .On("Detail", "UsrPeriodicalEditionsId").IsEqual("Chapter", "Id")
                  .Where("Chapter", "UsrCode").IsEqual(Column.Parameter(code))
                  .And("Detail", "UsrReleaseStatusId").IsEqual(Column.Parameter(UsrPublishingOfficeConstants.PublishingStatus.Planned))
                   as Select;

                double totalSum = selectSum.ExecuteScalar<double>();
                
			 if (totalSum > 0)
            {
                return totalSum;
            }

            	return -1;
            
        }
    }
}