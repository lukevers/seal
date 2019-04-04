CREATE TABLE `media` (
    `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `file` varchar(255) NOT NULL,
    `team_id` int(10) unsigned NOT NULL,
    `user_id` int(10) unsigned NOT NULL,

    KEY `media_team_id_foreign_key` (`team_id`),
    KEY `media_user_id_foreign_key` (`user_id`),
    CONSTRAINT `media_team_id_foreign_key` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `media_user_id_foreign_key` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;