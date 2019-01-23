CREATE TABLE `subscribers` (
    `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `email` varchar(255) NOT NULL,
    `team_id` int(10) unsigned NULL,
    `referrer` varchar(255),
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` timestamp NULL DEFAULT NULL,
    KEY `subscribers_team_id_foreign_key` (`team_id`),
    CONSTRAINT `subscribers_team_id_foreign_key` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE RESTRICT,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;