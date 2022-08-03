using System;

namespace PublishingOffice.ConfigurationConstants
{
    public static class UsrPublishingOfficeConstants
    {
        /// <summary>
        /// Справочник "Периодичность публикаций"
        /// </summary>
        public static class PublishingInterval
        {
            /// <summary>
            /// Каждый день
            /// </summary>
            public static readonly Guid Everyday = new Guid("116e5704-5eb5-4677-bed0-df1f4c3bf256");
            /// <summary>
            /// Каждую неделю
            /// </summary>
            public static readonly Guid Everyweek = new Guid("b3e72c65-78cd-4418-b7ec-9fea1ec72383");
            /// <summary>
            /// Каждый месяц
            /// </summary>
            public static readonly Guid EveryMonth = new Guid("b4ef61da-4076-4805-84b7-87dcde325282");

        }

        /// <summary>
        /// Справочник "Состояние публикации"
        /// </summary>
        public static class PublishingStatus
        {
            /// <summary>
            ///  Запланирован
            /// </summary>
            public static readonly Guid Planned = new Guid("a18c7742-2bc8-4254-9444-c250c2d3ff09");
            /// <summary>
            /// В работе
            /// </summary>
            public static readonly Guid InProgress = new Guid("4e4c3df0-1e03-4d39-8249-83a635aa67cc");
            /// <summary>
            /// Завершен
            /// </summary>
            public static readonly Guid Completed = new Guid("148f329b-c2a8-49fb-953d-ce8697b3631a");
        }
    }
}