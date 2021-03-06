﻿using System.Threading.Tasks;
using DemoCommon.Models;
using DemoServer.Utils;
using DemoServer.Utils.Attachments;
using DemoServer.Utils.Cache;
using DemoServer.Utils.Database;
using DemoServer.Utils.UserId;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
#region Usings
using System.IO;
using Raven.Client.Documents.Session;
#endregion

namespace DemoServer.Controllers.Demos.Attachments.StoreAttachment
{
    public class StoreAttachmentController : DemoCodeController
    {
        private const string DefaultDocumentId = "companies/2-A";
        private const string DefaultFilePath = ".//DemoResources//raven_logo.png";

        public StoreAttachmentController(UserIdContainer userId, UserStoreCache userStoreCache,
            MediaStoreCache mediaStoreCache, DatabaseSetup databaseSetup) : base(userId, userStoreCache,
            mediaStoreCache, databaseSetup)
        {
        }

        private Company InitialCompanyDocument => new Company
        {
            Id = DefaultDocumentId,
            Name = "Company Name",
            Address = new Address()
            {
                Line1 = "1 Plaza Center"
            }
        };

        private async Task SetRunPrerequisites(string documentId)
        {
            await DatabaseSetup.EnsureUserDocumentExists(UserId, documentId, InitialCompanyDocument);
        }

        [HttpPost]
        public async Task<IActionResult> Run(RunParams runParams)
        {
            string documentId = runParams.DocumentId ?? DefaultDocumentId;

            await SetRunPrerequisites(documentId);

            string attachmentName = runParams.AttachmentName;
            string contentType = runParams.ContentType;
            AttachmentWrapper attachment;

            if (runParams.Attachment == null)
            {
                attachment = new LocalFileAttachmentWrapper(DefaultFilePath);
            }
            else
            {
                FileValidator.Check(runParams.Attachment);
                attachment = new FormFileAttachmentWrapper(runParams.Attachment);
            }

            #region Demo
            using (IDocumentSession session = DocumentStoreHolder.Store.OpenSession())
            #region Step_1 
            using (Stream stream = attachment.OpenStream())
            #endregion
            {
                #region Step_2
                session.Advanced.Attachments.Store(documentId, attachmentName, stream, contentType);
                #endregion 
                
                #region Step_3
                session.SaveChanges();
                #endregion
            }
            #endregion
          
            return Ok($"Attachment {attachmentName} was stored successfully on document {documentId}");
        }
    }
    
    public class RunParams
    {
        public string DocumentId { get; set; }
        public IFormFile Attachment { get; set; }
        public string AttachmentName { get; set; }
        public string ContentType { get; set; }
    }
}
