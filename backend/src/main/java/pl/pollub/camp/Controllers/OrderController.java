package pl.pollub.camp.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import pl.pollub.camp.Models.OrderStatus;
import pl.pollub.camp.Models.Orders;
import pl.pollub.camp.Models.Users;
import pl.pollub.camp.Models.Mosaics;
import pl.pollub.camp.Models.Tools;
import pl.pollub.camp.Repositories.OrderRepository;
import pl.pollub.camp.Repositories.UserRepository;
import pl.pollub.camp.Repositories.ToolRepository;
import pl.pollub.camp.Repositories.MosaicRepository;

import java.util.List;
import java.time.LocalDateTime;

@Controller
@RequestMapping(path = "/order")
public class OrderController {
    @Autowired
    UserRepository userRepository;
    @Autowired
    OrderRepository orderRepository;
    @Autowired
    MosaicRepository mosaicRepository;
    @Autowired
    ToolRepository toolRepository;

    @PostMapping(path = "/addOrder")
    public @ResponseBody String addOrder(
            @RequestParam String comment,
            @RequestParam int userId,
            @RequestParam(required = false) int mosaicId,
            @RequestParam(required = false) List<Integer> toolIds) {

        Users u = userRepository.findById(userId).orElse(null);
        if (u == null) {
            return "User not found";
        }
        Mosaics mosaic = mosaicRepository.findById(mosaicId).orElse(null);
        if (mosaic == null) {
            return "Mosaic not found";
        }
        List<Tools> tools = new java.util.ArrayList<>();
        if (toolIds != null) {
            for (Integer toolId : toolIds) {
                toolRepository.findById(toolId).ifPresent(tools::add);
            }
            if (!tools.isEmpty() && tools.size() != toolIds.size()) {
                return "Tools not found";
            }
        }

        if (mosaic == null && tools.isEmpty()) {
            return "You must choose at least one product: a mosaic or tools.";
        }

        double totalCost = 0.0;
        if (mosaic != null && mosaic.getPrice() != null) {
            totalCost += mosaic.getPrice();
        }
        for (Tools tool : tools) {
            if (tool.getPrice() != null) {
                totalCost += tool.getPrice();
            }
        }

        Orders o = new Orders();
        o.setComment(comment);
        o.setUser(u);
        o.setMosaic(mosaic);
        o.setTools(tools);
        o.setOrderStatus(OrderStatus.PAID);
        o.setTotalCost(totalCost);

        orderRepository.save(o);
        return "Order successfully created. Total cost: " + totalCost;
    }

    @GetMapping(path = "/allOrders")
    public @ResponseBody Iterable<Orders> getAllOrders(){
        return orderRepository.findAll();
    }

    @PatchMapping(path = "/updateStatus/{orderId}")
    public @ResponseBody String updateOrderStatus(
            @PathVariable int orderId,
            @RequestParam OrderStatus newStatus) {
        Orders order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            return "Order not found";
        }
        OrderStatus currentStatus = order.getOrderStatus();

        // правила перехода статусов
        if (currentStatus == OrderStatus.PAID && newStatus == OrderStatus.PENDING ||
                currentStatus == OrderStatus.PENDING && newStatus == OrderStatus.DELIVERED) {
            order.setOrderStatus(newStatus);
            orderRepository.save(order);
            return "Order status updated to " + newStatus;
        } else {
            return "Invalid status transition from " + currentStatus + " to " + newStatus;
        }
    }
}
