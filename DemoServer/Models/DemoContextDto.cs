﻿using System.Collections.Generic;
using DemoServer.Utils;

namespace DemoServer.Models
{
    public class DemoContextDto
    {
        public List<DemoContainer.CategoryResult> Categories { get; set; }

        public bool ConferenceMode { get; set; }
    }
}