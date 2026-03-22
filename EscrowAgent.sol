// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract EscrowAgent {
    struct Task {
        address client;
        address worker;
        uint256 amount;
        uint256 deadline;
        bool funded;
        bool released;
        bool refunded;
        string proofUrl;
        string proofHash;
    }

    uint256 public nextTaskId;
    mapping(uint256 => Task) public tasks;

    event TaskCreated(
        uint256 indexed taskId,
        address indexed client,
        address indexed worker,
        uint256 amount,
        uint256 deadline
    );
    event TaskFunded(uint256 indexed taskId, uint256 amount);
    event WorkSubmitted(uint256 indexed taskId, string proofUrl, string proofHash);
    event FundsReleased(uint256 indexed taskId, address indexed worker, uint256 amount);
    event TaskRefunded(uint256 indexed taskId, address indexed client, uint256 amount);

    function createTask(address worker, uint256 amount, uint256 deadline) external returns (uint256 taskId) {
        require(worker != address(0), "worker required");
        require(amount > 0, "amount required");
        require(deadline > block.timestamp, "deadline must be future");

        taskId = nextTaskId++;
        tasks[taskId] = Task({
            client: msg.sender,
            worker: worker,
            amount: amount,
            deadline: deadline,
            funded: false,
            released: false,
            refunded: false,
            proofUrl: "",
            proofHash: ""
        });

        emit TaskCreated(taskId, msg.sender, worker, amount, deadline);
    }

    function fundTask(uint256 taskId) external payable {
        Task storage task = tasks[taskId];

        require(task.client != address(0), "task not found");
        require(task.client == msg.sender, "only client");
        require(!task.funded, "already funded");
        require(!task.refunded, "task refunded");
        require(msg.value == task.amount, "incorrect amount");

        task.funded = true;
        emit TaskFunded(taskId, msg.value);
    }

    function submitWork(uint256 taskId, string calldata proofUrl, string calldata proofHash) external {
        Task storage task = tasks[taskId];

        require(task.client != address(0), "task not found");
        require(task.worker == msg.sender, "only worker");
        require(task.funded, "task not funded");
        require(!task.released, "already released");
        require(!task.refunded, "task refunded");
        require(bytes(proofUrl).length > 0, "proof url required");
        require(bytes(proofHash).length > 0, "proof hash required");

        task.proofUrl = proofUrl;
        task.proofHash = proofHash;
        emit WorkSubmitted(taskId, proofUrl, proofHash);
    }

    function approveRelease(uint256 taskId) external {
        Task storage task = tasks[taskId];

        require(task.client != address(0), "task not found");
        require(task.client == msg.sender, "only client");
        require(task.funded, "task not funded");
        require(!task.released, "already released");
        require(!task.refunded, "task refunded");
        require(bytes(task.proofHash).length > 0, "work not submitted");

        task.released = true;
        payable(task.worker).transfer(task.amount);
        emit FundsReleased(taskId, task.worker, task.amount);
    }

    function refundAfterDeadline(uint256 taskId) external {
        Task storage task = tasks[taskId];

        require(task.client != address(0), "task not found");
        require(task.client == msg.sender, "only client");
        require(task.funded, "task not funded");
        require(!task.released, "already released");
        require(!task.refunded, "already refunded");
        require(block.timestamp > task.deadline, "deadline not passed");

        task.refunded = true;
        payable(task.client).transfer(task.amount);
        emit TaskRefunded(taskId, task.client, task.amount);
    }
}
