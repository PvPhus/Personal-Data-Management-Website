﻿using BusinessLogicLayer;
using BusinessLogicLayer.Interfaces;
using DataAccessLayer.Interfaces;
using DataModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace API_PersonalDataManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PermissionController : ControllerBase
    {
        private readonly IPermissionBusiness _permissionBusiness;
        public PermissionController(IPermissionBusiness permissionBusiness)
        {
            _permissionBusiness = permissionBusiness;
        }

        [Route("update-permission")]
        [HttpPut]
        public IActionResult UpdateItem([FromBody] PermissionModel model)
        {
            try
            {
                _permissionBusiness.Update(model);
                return Ok(model);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        [HttpGet("get_permission_user")]
        public IActionResult GetPermissionUser(int user_id, int group_id)
        {
            try
            {
                var permission = _permissionBusiness.GetPermissionUser(user_id, group_id);
                if (permission == null)
                {
                    return NotFound("No permission found for the search file name.");
                }
                return Ok(permission);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
    }
}
