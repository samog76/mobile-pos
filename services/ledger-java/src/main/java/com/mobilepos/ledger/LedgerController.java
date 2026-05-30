package com.mobilepos.ledger;

import java.math.BigDecimal;
import java.util.Map;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ledger")
public class LedgerController {
    private final JdbcTemplate jdbc;

    public LedgerController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
        this.jdbc.execute("CREATE TABLE IF NOT EXISTS ledger_entries (id SERIAL PRIMARY KEY, account VARCHAR(64), amount NUMERIC(18,2))");
    }

    @PostMapping("/transactions")
    public Map<String, String> post(@RequestBody Map<String, String> payload) {
        String debit = payload.getOrDefault("debitAccount", "cash");
        String credit = payload.getOrDefault("creditAccount", "merchant");
        BigDecimal amount = new BigDecimal(payload.getOrDefault("amount", "0"));
        jdbc.update("INSERT INTO ledger_entries(account, amount) VALUES (?, ?)", debit, amount.negate());
        jdbc.update("INSERT INTO ledger_entries(account, amount) VALUES (?, ?)", credit, amount);
        return Map.of("status", "posted");
    }

    @GetMapping("/balances/{account}")
    public Map<String, Object> balance(@PathVariable String account) {
        BigDecimal balance = jdbc.queryForObject(
                "SELECT COALESCE(SUM(amount),0) FROM ledger_entries WHERE account=?", BigDecimal.class, account);
        return Map.of("account", account, "balance", balance);
    }
}
