CREATE TABLE `users` (
    `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `email` varchar(255) NOT NULL UNIQUE,
    `password` varchar(255) DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` timestamp NULL DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `user_create_codes` (
    `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `code` varchar(36) DEFAULT NULL UNIQUE,
    `user_id` int(10) unsigned DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `redeemed_at` datetime DEFAULT NULL,
    KEY `user_create_codes_team_id_foreign_key` (`user_id`),
    CONSTRAINT `user_create_codes_team_id_foreign_key` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TRIGGER `user_create_codes_trigger_insert` BEFORE INSERT ON `user_create_codes` FOR EACH ROW
	SET new.code = LEFT(UUID(), 36);

CREATE TABLE `teams` (
    `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `domain` varchar(255) NOT NULL UNIQUE,
    `theme` varchar(32) NOT NULL DEFAULT 'basic',
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` timestamp NULL DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `team_members` (
    `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    `role` ENUM('owner', 'member') NOT NULL DEFAULT 'member',
    `team_id` int(10) unsigned NOT NULL,
    `user_id` int(10) unsigned NOT NULL,
    `added_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY `team_members_user_id_foreign_key` (`user_id`),
    KEY `team_members_team_id_foreign_key` (`team_id`),
    CONSTRAINT `team_members_user_id_foreign_key` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `team_members_team_id_foreign_key` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE RESTRICT,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;