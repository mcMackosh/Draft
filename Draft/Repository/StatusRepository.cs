//using Microsoft.EntityFrameworkCore;
//using MyToDo.Models;
//using MyToDo.Repository.DTO;
//using MyToDo.Repository.IRepository;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Net.NetworkInformation;
//using static MyToDo.Controllers.DoStatusController;

//namespace MyToDo.Repository
//{
//    public class StatusRepository : IStatusRepository
//    {
//        private TodoContext _context;
//        public StatusRepository(TodoContext context)
//        {
//            _context = context;
//        }

//        public List<DoStatus> GetAllStatusWithDo(int userId, Filter filter)
//        {
//            try
//            {
//                var query = _context.DoStatuses.Where(p => p.UserId == userId).Include(x => x.Dos).AsQueryable();

//                if (!string.IsNullOrEmpty(filter.StatusName))
//                {
//                    query = query.Where(p => p.Name.Contains(filter.StatusName)).AsQueryable();
//                }

//                if (filter.SelectedStatuses != null && filter.SelectedStatuses.Any())
//                {
//                    query = query.Where(p => filter.SelectedStatuses.Contains(p.Id));
//                }

//                var result = query.OrderBy(x => x.OrderOfPlacement).ToList();

//                foreach (var status in result)
//                {
//                    var doListQuery = status.Dos.AsQueryable();

//                    if (!string.IsNullOrEmpty(filter.DoName))
//                    {
//                        doListQuery = doListQuery.Where(d => d.Task.Contains(filter.DoName));
//                    }

//                    if (filter.DateRangeFrom.HasValue && filter.DateRangeTo.HasValue)
//                    {
//                        doListQuery = doListQuery.Where(d => d.StartTime >= filter.DateRangeFrom.Value
//                        && d.StartTime <= filter.DateRangeTo.Value);
//                    }

//                    if (filter.DateOrder?.ToLower() == "desc")
//                    {
//                        doListQuery = doListQuery.OrderByDescending(p => p.StartTime);
//                    }
//                    if (filter.DateOrder?.ToLower() == "asc")
//                    {
//                        doListQuery = doListQuery.OrderBy(p => p.StartTime);
//                    }

//                    status.Dos = doListQuery.ToList();
//                }

//                return result.ToList();
//            }
//            catch
//            {
//                return new List<DoStatus>();
//            }

//        }


//        public List<DoStatus> GetAllStatus(int userId)
//        {
//            try
//            {
//                return _context.DoStatuses.Where(p => p.UserId == userId).OrderBy(x => x.OrderOfPlacement).ToList();
//            }
//            catch
//            {
//                return null;
//            }

//        }

//        public DoStatus? GetOneSatus(int userId, int id)
//        {
//            try
//            {
//                return _context.DoStatuses.Where(p => p.UserId == userId && p.Id == id).FirstOrDefault();
//            }
//            catch
//            {
//                return null;
//            }
//        }
//        public bool CreateStatus(DoStatus doStatus, int userId)
//        {
//            try
//            {
//                bool isExist = _context.Users.Any(x => x.Id == userId);
//                if (isExist)
//                {
//                    doStatus.OrderOfPlacement = _context.DoStatuses.Count(x => x.UserId == userId);
//                    doStatus.UserId = userId;
//                    _context.DoStatuses.Add(doStatus);
//                    _context.SaveChanges();
//                    return true;
//                }
//                return false;

//            }
//            catch
//            {
//                return false;
//            }

//        }
//        public bool DeleteStatus(int doStatusId, int userId)
//        {
//            try
//            {
//                var doStatus = _context.DoStatuses.Find(doStatusId);

//                if (doStatus == null && doStatus?.UserId != userId)
//                {
//                    return false;
//                }
//                _context.DoStatuses.Remove(doStatus);
//                _context.SaveChanges();
//                return true;
//            }
//            catch
//            {
//                return false;
//            }

//        }
//        public bool UpdateStatus(DoStatus data, int userId)
//        {
//            try
//            {
//                var doStatus = _context.DoStatuses.Find(data.Id);
//                if (doStatus == null)
//                {
//                    return false;
//                }

//                doStatus.Name = data.Name;
//                doStatus.Color = data.Color;

//                _context.DoStatuses.Update(doStatus);
//                _context.SaveChanges();
//                return true;
//            }
//            catch
//            {
//                return false;
//            }

//        }

//        public bool UpdateOrderOfPlacment(StatusOrderResponse[] statusOrderResponses, int userId)
//        {
//            using (var transaction = _context.Database.BeginTransaction())
//            {
//                try
//                {
//                    var userStatuses = _context.DoStatuses
//                        .Where(s => s.UserId == userId)
//                        .OrderBy(s => s.OrderOfPlacement)
//                        .ToList();

//                    var statusIds = statusOrderResponses.Select(s => s.id).ToHashSet();
//                    if (!userStatuses.All(s => statusIds.Contains(s.Id)))
//                    {
//                        return false;
//                    }

//                    foreach (var statusOrderResponse in statusOrderResponses)
//                    {
//                        var status = userStatuses.FirstOrDefault(s => s.Id == statusOrderResponse.id);
//                        if (status != null)
//                        {
//                            status.OrderOfPlacement = statusOrderResponse.OrderOfPlacment;
//                        }
//                    }

//                    int maxOrder = statusOrderResponses.Max(s => s.OrderOfPlacment);
//                    foreach (var status in userStatuses.Where(s => !statusIds.Contains(s.Id)))
//                    {
//                        status.OrderOfPlacement = ++maxOrder;
//                    }

//                    // Save changes
//                    _context.SaveChanges();
//                    transaction.Commit();
//                    return true;
//                }
//                catch
//                {
//                    transaction.Rollback();
//                    return false;
//                }
//            }
//        }

//    }
//}

////public bool UpdateOrderOfPlacment(StatusOrderResponse[] statusOrderResponses, int userId)
////{
////    using var transaction = _context.Database.BeginTransaction();
////    try
////    {
////        var allStatuses = _context.DoStatuses.OrderBy(s => s.OrderOfPlacement).ToList();

////        foreach (var statusOrderResponse in statusOrderResponses)
////        {
////            var itemToUpdate = allStatuses.FirstOrDefault(s => s.Id == statusOrderResponse.id);
////            if (itemToUpdate == null)
////            {
////                throw new Exception($"Status with Id {statusOrderResponse.id} not found.");
////            }

////            int newOrderOfPlacment = statusOrderResponse.OrderOfPlacment;
////            if (newOrderOfPlacment < 1)
////            {
////                newOrderOfPlacment = 1;
////            }
////            else if (newOrderOfPlacment > allStatuses.Count)
////            {
////                newOrderOfPlacment = allStatuses.Count;
////            }

////            allStatuses.Remove(itemToUpdate);
////            allStatuses.Insert(newOrderOfPlacment - 1, itemToUpdate);
////        }

//// Reorder the placements
////        for (int i = 0; i < allStatuses.Count; i++)
////        {
////            allStatuses[i].OrderOfPlacement = i + 1;
////        }

////        _context.SaveChanges();
////        transaction.Commit();
////        return true;
////    }
////    catch (Exception ex)
////    {
////        transaction.Rollback();
////        return false;
////    }
////}