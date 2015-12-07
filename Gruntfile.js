module.exports = function(grunt) {

	// Load all grunt tasks in package.json matching the `grunt-*` pattern.
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		/**
		 * Bind Grunt tasks to Git hooks.
		 *
		 * @link https://github.com/wecodemore/grunt-githooks
		 */
		githooks: {
			all: {
				'pre-commit': 'default'
			}
		},

		/**
		 * Convert a set of images into a spritesheet and corresponding CSS variables.
		 *
		 * @link https://github.com/Ensighten/grunt-spritesmith
		 */
		sprite: {
			all: {
				'src': 'images/sprites/*.png',
				'dest': 'images/sprites.png',
				'destCss': 'sass/base/_sprites.scss',
				'imgPath': 'images/sprites.png',
				'algorithm': 'binary-tree',
			}
		},

		/**
		 * Minify SVGs using SVGO.
		 *
		 * @link https://github.com/sindresorhus/grunt-svgmin
		 */
		svgmin: {
			options: {
				plugins: [
					{ removeComments: true },
					{ removeUselessStrokeAndFill: true },
					{ removeEmptyAttrs: true }
				]
			},
			dist: {
				files: [{
					expand: true,
					cwd: '',
					src: ['images/svg-icons/*.svg'],
					dest: ''
				}]
			}
		},

		/**
		 * Merge SVGs into a single SVG.
		 *
		 * @link https://github.com/FWeinb/grunt-svgstore
		 */
		svgstore: {
			options: {
				prefix: 'icon-',
				cleanup: ['fill', 'style'],
				svg: {
					style: 'display: none;'
				}
			},
			default: {
				files: {
					'images/svg-defs.svg': 'images/svg-icons/*.svg',
				}
			}
		},

		/**
		 * Compile Sass into CSS using node-sass.
		 *
		 * @link https://github.com/sindresorhus/grunt-sass
		 */
		sass: {
			options: {
				outputStyle: 'expanded',
				sourceComments: true,
				sourceMap: true,
				includePaths: [
					'bower_components/bourbon/app/assets/stylesheets',
					'bower_components/neat/app/assets/stylesheets'
				]
			},
			dist: {
				files: {
					'style.css': 'sass/style.scss'
				}
			}
		},

		/**
		 * Apply several post-processors to CSS using PostCSS.
		 *
		 * @link https://github.com/nDmitry/grunt-postcss
		 */
		postcss: {
			options: {
				map: true,
				processors: [
					require('autoprefixer')({ browsers: 'last 2 versions' }),
					require('css-mqpacker')({ sort: true }),
			]},
			dist: {
				src: ['style.css', '!*.min.js']
			}
		},

		/**
		 * A modular minifier, built on top of the PostCSS ecosystem.
		 *
		 * @link https://github.com/ben-eb/cssnano
		 */
		cssnano: {
			options: {
				autoprefixer: false,
				safe: true,
			},
			dist: {
				files: {
					'style.min.css': 'style.css'
				}
			}
		},

		/**
		 * Concatenate files.
		 *
		 * @link https://github.com/gruntjs/grunt-contrib-concat
		 */
		concat: {
			dist: {
				src: ['js/concat/*.js'],
				dest: 'js/project.js',
			}
		},

		/**
		 * Minify files with UglifyJS.
		 *
		 * @link https://github.com/gruntjs/grunt-contrib-uglify
		 */
		uglify: {
			build: {
				options: {
					sourceMap: true,
					mangle: false
				},
				files: [{
					expand: true,
					cwd: 'js/',
					src: ['**/*.js', '!**/*.min.js', '!concat/*.js', '!customizer.js'],
					dest: 'js/',
					ext: '.min.js'
				}]
			}
		},

		/**
		 * Minify PNG, JPG, and GIF images.
		 *
		 * @link https://github.com/gruntjs/grunt-contrib-imagemin
		 */
		imagemin: {
			dynamic: {
				files: [{
					expand: true,
					cwd: 'images/',
					src: ['**/*.{png,jpg,gif}'],
					dest: 'images/'
				}]
			}
		},

		/**
		 * Run tasks whenever watched files change.
		 *
		 * @link https://github.com/gruntjs/grunt-contrib-watch
		 */
		watch: {

			scripts: {
				files: ['js/**/*.js'],
				tasks: ['javascript'],
				options: {
					spawn: false,
					livereload: true,
				},
			},

			css: {
				files: ['sass/**/*.scss'],
				tasks: ['styles'],
				options: {
					spawn: false,
					livereload: true,
				},
			},

			sprite: {
				files: ['images/sprites/*.png'],
				tasks: ['sprite', 'styles'],
				options: {
					spawn: false,
					livereload: true,
				},
			},

			svg: {
				files: ['images/svg-icons/*.svg'],
				tasks: ['svgstore'],
				options: {
					spawn: false,
					livereload: true,
				},
			},

			images: {
				files: ['images/*'],
				tasks: ['imageminnewer'],
				options: {
					spawn: false,
					livereload: true,
				},
			},
		},

		/**
		 * Run shell commands.
		 *
		 * @link https://github.com/sindresorhus/grunt-shell
		 */
		shell: {
			grunt: {
				command: '',
			}
		},

		/**
		 * Clear files and folders.
		 *
		 * @link https://github.com/gruntjs/grunt-contrib-clean
		 */
		clean: {
			js: ['js/project*', 'js/**/*.min.js']
		},

		/**
		 * Internationalize WordPress themes and plugins.
		 *
		 * @link https://github.com/claudiosmweb/grunt-wp-i18n
		 */
		makepot: {
			theme: {
				options: {
					cwd: '',
					domainPath: 'languages/',
					potFilename: '_s.pot',
					type: 'wp-theme'
				}
			}
		},

		/**
		 * Grunt plugin for running PHP Code Sniffer.
		 *
		 * @link https://github.com/SaschaGalley/grunt-phpcs
		 */
		phpcs: {
			application: {
				dir: [
					'**/*.php',
					'!**/node_modules/**'
				]
			},
			options: {
				bin: '~/phpcs/scripts/phpcs',
				standard: 'WordPress'
			}
		},

		/**
		 * Create theme Sass documentation.
		 *
		 * @link https://github.com/SassDoc/grunt-sassdoc
		 */
		sassdoc: {
			default: {
				src: [
					'sass/**/*.scss',
					'bower_components/bourbon/app/assets/stylesheets',
					'bower_components/neat/app/assets/stylesheets'
				],
				options: {
					dest: './sassdoc/',
					display: {
						access: ['public'],
						watermark: false
					},
					groups: {
						wds: 'WebDevStudios',
						'undefined': 'Bourbon & Neat'
					},
					description: 'Sass Documentation, which includes Bourbon and Neat documentation as well.',
					sort: ['group>'],
				},
			},
		},

		/**
		 * Automatic Notifications when Grunt tasks fail.
		 *
		 * @link https://github.com/dylang/grunt-notify
		 */
		notify_hooks: {
			options: {
				enabled: true,
				max_jshint_notifications: 5,
				title: "wd_s",
				success: false,
				duration: 2,
			}
		},
	});

	// Register Grunt tasks.
	grunt.registerTask('styles', ['sass', 'postcss', 'cssnano']);
	grunt.registerTask('javascript', ['concat', 'uglify']);
	grunt.registerTask('imageminnewer', ['newer:imagemin']);
	grunt.registerTask('sprites', ['sprite']);
	grunt.registerTask('icons', ['svgmin', 'svgstore']);
	grunt.registerTask('i18n', ['makepot']);
	grunt.registerTask('default', ['styles', 'javascript', 'sprites', 'imageminnewer', 'icons', 'i18n', 'sassdoc']);

	// grunt-notify shows native notifications on errors.
	grunt.loadNpmTasks('grunt-notify');
	grunt.task.run('notify_hooks');
};