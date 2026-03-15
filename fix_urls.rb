require 'fileutils'

directory = 'c:/Users/lucas/OneDrive/Documentos/Trabalhos I.A/WebSiteObservatório/Website_Fiocruz_Pesquisadores'
exclude_dirs = ['_site', '.git', '.jekyll-cache']
include_extensions = ['.html', '.md']

Dir.glob(File.join(directory, '**', '*')).each do |file_path|
  next if File.directory?(file_path)
  next if exclude_dirs.any? { |d| file_path.include?("/#{d}/") }
  next unless include_extensions.include?(File.extname(file_path))

  content = File.read(file_path, encoding: 'utf-8')
  
  # Replace href="/path" with href="{{ site.baseurl }}/path"
  new_content = content.gsub(/href="\/([^\/][^"]*)"/, 'href="{{ site.baseurl }}/\1"')
  
  # Replace src="/path" with src="{{ site.baseurl }}/path"
  new_content = new_content.gsub(/src="\/([^\/][^"]*)"/, 'src="{{ site.baseurl }}/\1"')
  
  # Special case for href="/"
  new_content = new_content.gsub('href="/"', 'href="{{ site.baseurl }}/"')

  if new_content != content
    File.write(file_path, new_content, encoding: 'utf-8')
    puts "Updated: #{file_path}"
  end
end

# Update _config.yml
config_path = File.join(directory, '_config.yml')
config_content = File.read(config_path, encoding: 'utf-8')

config_content.gsub!('url: ""', 'url: "https://lucasbraga027.github.io"')
config_content.gsub!('baseurl: ""', 'baseurl: "/observatorio-estrategia-site"')

File.write(config_path, config_content, encoding: 'utf-8')
puts "Updated: _config.yml"
