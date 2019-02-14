CREATE TABLE `analytics_pageviews` (
    `id` bigint(10) unsigned NOT NULL AUTO_INCREMENT,
    `host` varchar(255) NOT NULL,
    `path` varchar(255) NOT NULL,
    `method` varchar(16) NOT NULL,
    `query` varchar(255) NOT NULL,
    `remote_address` varchar(255) NOT NULL,
    `user_agent` TEXT,
    `status` int(10) NOT NULL,
    `is_new` tinyint(1) NOT NULL,
    `initial_rid` varchar(32) NOT NULL,
    `viewed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `analytics_pageview_useragents` (
    `id` bigint(10) unsigned NOT NULL AUTO_INCREMENT,
    `pageview_id` bigint(10) unsigned NOT NULL,
    `browser_name` varchar(255),
    `browser_version` varchar(255),
    `browser_engine` varchar(255),
    `browser_engine_version` varchar(255),
    `localization` varchar(255),
    `mobile` tinyint(1),
    `os_name` varchar(255),
    `os_version` varchar(255),
    `platform` varchar(255),
    `raw` TEXT,

    KEY `analytics_pageview_useragents_pageview_key` (`pageview_id`),
    CONSTRAINT `analytics_pageview_useragents_pageview_key` FOREIGN KEY (`pageview_id`) REFERENCES `analytics_pageviews` (`id`) ON DELETE RESTRICT,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `analytics_pageview_referers` (
    `id` bigint(10) unsigned NOT NULL AUTO_INCREMENT,
    `pageview_id` bigint(10) unsigned NOT NULL,
    `protocol` varchar(16) NOT NULL,
    `host` varchar(255) NOT NULL,
    `path` varchar(255) NOT NULL,
    `query` varchar(255) NOT NULL,

    KEY `analytics_pageview_referers_pageview_key` (`pageview_id`),
    CONSTRAINT `analytics_pageview_referers_pageview_key` FOREIGN KEY (`pageview_id`) REFERENCES `analytics_pageviews` (`id`) ON DELETE RESTRICT,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;