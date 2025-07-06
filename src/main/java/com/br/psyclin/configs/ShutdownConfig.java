package com.br.psyclin.configs;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.stereotype.Component;

@Component
public class ShutdownConfig implements ApplicationListener<ContextClosedEvent> {

    @Autowired
    private HikariDataSource dataSource;

    @Override
    public void onApplicationEvent(ContextClosedEvent event) {
        if (dataSource != null && !dataSource.isClosed()) {
            dataSource.close();
        }
    }
}